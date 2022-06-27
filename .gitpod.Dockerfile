FROM gitpod/workspace-full

# Install custom tools, runtime, etc.
RUN brew install fzf
RUN apt-get update && \
  apt-get install -y \
      libnss3

# RUN sh -c "$(curl -fsLS chezmoi.io/get)" -- init --apply riotrah