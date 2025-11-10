{
  description = "NestJS API Gateway Dev Environment";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  
  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_22
        postgresql_16
        redis
        nodePackages.pnpm
        nodePackages.typescript
        nodePackages.typescript-language-server
        pgcli
        jq
        curl
        httpie
        docker-compose
        docker
      ];
      
      shellHook = ''
        echo "Node.js: $(node --version)"
        echo "pnpm: $(pnpm --version)"
        echo "PostgreSQL: $(psql --version | head -n1)"
        echo "Redis: $(redis-server --version)"
        echo "Docker: $(docker --version)"
        
        # Setup PostgreSQL
        export PGDATA="$PWD/.postgres"
        # export PGHOST="$PGDATA"
        
        if [ ! -d "$PGDATA" ]; then
          echo "Initializing PostgreSQL..."
          initdb -D "$PGDATA" --username=postgres --no-locale --encoding=UTF8
          echo "unix_socket_directories = '$PGDATA'" >> "$PGDATA/postgresql.conf"
          echo "listen_addresses = '127.0.0.1'" >> "$PGDATA/postgresql.conf"
          echo "port = 5432" >> "$PGDATA/postgresql.conf"
        fi
        
        # Setup Redis
        export REDIS_DATA="$PWD/.redis"
        mkdir -p "$REDIS_DATA"
        
        # Load environment variables
        if [ -f .env ]; then
          export $(cat .env | grep -v '^#' | xargs)
        fi
        
        # Helper functions for NIX development
        start_nix_services() {
          echo "Starting Nix services..."
          # Check if Postgres is running
          if pg_ctl -D "$PGDATA" status > /dev/null 2>&1; then
            echo "Postgres already running"
          else
            pg_ctl -D "$PGDATA" -l "$PGDATA/logfile" start -o "-i -p 5432"
          fi
          
          # Redis
          if pgrep redis-server > /dev/null; then
            echo "Redis already running"
          else
            redis-server --dir "$REDIS_DATA" --daemonize yes --port 6379
          fi

          echo "PostgreSQL & Redis started!"
          echo "DATABASE_URL=postgresql://127.0.0.1:5432/hris-server"
          echo "REDIS_URL=redis://localhost:6379"
        }
        
        stop_nix_services() {
          echo "Stopping Nix services..."
          pg_ctl -D "$PGDATA" stop 2>/dev/null || true
          redis-cli shutdown 2>/dev/null || true
          echo "Services stopped!"
        }
        
        setup_db() {
          echo "Creating database..."
          createdb nestjs_gateway -h localhost 2>/dev/null || echo "Database already exists"
        }
        
        # Helper functions for DOCKER development
        start_docker_services() {
          echo "Starting Docker services..."
          docker-compose up -d postgres redis
          echo "Docker services started!"
          echo "Connection strings:"
          echo "   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/hris-server"
          echo "   REDIS_URL=redis://localhost:6380"
        }
        
        stop_docker_services() {
          echo "Stopping Docker services..."
          docker-compose down
          echo "Docker services stopped!"
        }
        
        # Development commands
        dev_nix() {
          echo "Running in NIX mode..."
          export DATABASE_URL="postgresql://localhost:5432/hris-server"
          export REDIS_URL="redis://localhost:6379"
          pnpm run start:dev
        }
        
        dev_docker() {
          echo "Running in DOCKER mode..."
          export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hris_server"
          export REDIS_URL="redis://localhost:6380"
          pnpm run start:dev
        }
        
        echo ""
        echo "Commands:"
        echo ""
        echo "NIX Development:"
        echo "  start_nix_services    - Start local PostgreSQL & Redis"
        echo "  stop_nix_services     - Stop local services"
        echo "  setup_db              - Create database"
        echo "  dev_nix               - Run app with Nix services"
        echo ""
        echo "Docker Development:"
        echo "  start_docker_services - Start Docker containers"
        echo "  stop_docker_services  - Stop Docker containers"
        echo "  dev_docker            - Run app with Docker services"
        echo ""
        echo "Production:"
        echo "  docker-compose up --build"
        echo ""
        echo "Quick start:"
        echo "  1. pnpm install"
        echo "  2. start_nix_services && setup_db"
        echo "  3. dev_nix"
      '';
      
      LOCALE_ARCHIVE = "${pkgs.glibcLocales}/lib/locale/locale-archive";
    };
  };
}
