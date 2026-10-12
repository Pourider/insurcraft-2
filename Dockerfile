# syntax=docker/dockerfile:1.7
#
# InsurCraft 2.0 as a container: a static website, nothing else.
#   /           InsurCraft Fácil (web/: plain HTML, no build step)
#   /completa/  the full app compiled to WebAssembly
# PDFs are processed in each visitor's browser. The container never receives, stores or logs a
# document: it only hands out files. See docs/SECURITY-CISO.md.
#
#   docker build -t insurcraft:2.0.0 .
#   docker compose up -d          (http://127.0.0.1:8080)

ARG RUST_IMAGE=rust:1-bookworm
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.29-alpine

# ---- stage 1: compile the full app to WebAssembly -------------------------------------------
FROM ${RUST_IMAGE} AS build
ARG TRUNK_VERSION=0.21.14
RUN rustup target add wasm32-unknown-unknown \
 && curl -fsSL "https://github.com/trunk-rs/trunk/releases/download/v${TRUNK_VERSION}/trunk-x86_64-unknown-linux-gnu.tar.gz" \
    | tar -xz -C /usr/local/cargo/bin trunk \
 && trunk --version
WORKDIR /src
COPY . .
RUN cd apps/insurcraft-web && trunk build --release \
 && test -f /src/dist/web/index.html

# ---- stage 2: serve it ------------------------------------------------------------------------
FROM ${NGINX_IMAGE}
LABEL org.opencontainers.image.title="InsurCraft 2.0" \
      org.opencontainers.image.description="InsurCraft Fácil and the full InsurCraft PDF app, served as static files" \
      org.opencontainers.image.version="2.0.0" \
      org.opencontainers.image.licenses="MIT OR Apache-2.0" \
      org.opencontainers.image.source="https://github.com/Pourider/insurcraft-2" \
      org.opencontainers.image.vendor="Insur S.A."

USER root
# Only our site: drop the image's sample config and page. Files are owned by root and read-only
# to the server process, so a compromised worker cannot rewrite what visitors download.
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/* \
 && mkdir -p /etc/nginx/snippets
COPY --chown=root:root --chmod=0644 docker/nginx.conf /etc/nginx/conf.d/insurcraft.conf
COPY --chown=root:root --chmod=0644 docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --chown=root:root web/ /usr/share/nginx/html/
COPY --chown=root:root --from=build /src/dist/web/ /usr/share/nginx/html/completa/
RUN rm -f /usr/share/nginx/html/README.md \
 && chmod -R a+rX,go-w /usr/share/nginx/html \
 && nginx -t

# The base image's unprivileged user (uid 101); never root at runtime.
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
