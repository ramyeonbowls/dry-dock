FROM node:24-bookworm

ARG MAKEFLAGS="-j4"

RUN corepack enable \
    && corepack prepare pnpm@11.25.0 --activate

WORKDIR /workspace

CMD ["sleep", "infinity"]