#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to validate project name
validate_name() {
    local name=$1
    if [[ ! $name =~ ^[a-zA-Z0-9_-]+$ ]]; then
        print_error "Project name can only contain letters, numbers, hyphens, and underscores"
        return 1
    fi
    return 0
}

# Function to create app from template
create_app() {
    local app_name=$1
    local template_dir="template/<template_app_name>"
    local target_dir="apps/$app_name"

    print_info "Creating app: $app_name"

    # Check if template exists
    if [ ! -d "$template_dir" ]; then
        print_error "Template directory '$template_dir' not found"
        return 1
    fi

    # Check if target directory already exists
    if [ -d "$target_dir" ]; then
        print_error "App '$app_name' already exists in $target_dir"
        return 1
    fi

    # Create apps directory if it doesn't exist
    mkdir -p apps

    # Copy template to target directory
    print_info "Copying template to $target_dir..."
    cp -r "$template_dir" "$target_dir"

    # Replace template name in package.json
    if [ -f "$target_dir/package.json" ]; then
        print_info "Updating package.json..."
        sed -i.bak "s/<template_app_name>/$app_name/g" "$target_dir/package.json"
        rm "$target_dir/package.json.bak"
    else
        print_warning "package.json not found in $target_dir"
    fi

    # Replace template name in other common files
    find "$target_dir" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" \) -exec sed -i.bak "s/<template_app_name>/$app_name/g" {} \;
    find "$target_dir" -name "*.bak" -delete

    print_success "App '$app_name' created successfully in $target_dir"
}

# Function to create library from template
create_lib() {
    local lib_name=$1
    local template_dir="template/<template_lib_name>"
    local target_dir="libs/$lib_name"

    print_info "Creating library: $lib_name"

    # Check if template exists
    if [ ! -d "$template_dir" ]; then
        print_error "Template directory '$template_dir' not found"
        return 1
    fi

    # Check if target directory already exists
    if [ -d "$target_dir" ]; then
        print_error "Library '$lib_name' already exists in $target_dir"
        return 1
    fi

    # Create libs directory if it doesn't exist
    mkdir -p libs

    # Copy template to target directory
    print_info "Copying template to $target_dir..."
    cp -r "$template_dir" "$target_dir"

    # Replace template name in package.json
    if [ -f "$target_dir/package.json" ]; then
        print_info "Updating package.json..."
        sed -i.bak "s/<template_lib_name>/$lib_name/g" "$target_dir/package.json"
        rm "$target_dir/package.json.bak"
    else
        print_warning "package.json not found in $target_dir"
    fi

    # Replace template name in other common files
    find "$target_dir" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" \) -exec sed -i.bak "s/<template_lib_name>/$lib_name/g" {} \;
    find "$target_dir" -name "*.bak" -delete

    print_success "Library '$lib_name' created successfully in $target_dir"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [app|lib] <project_name>"
    echo ""
    echo "Commands:"
    echo "  app <name>    Create a new app from template"
    echo "  lib <name>    Create a new library from template"
    echo ""
    echo "Examples:"
    echo "  $0 app my-awesome-app"
    echo "  $0 lib my-utility-lib"
    echo ""
    echo "Project structure:"
    echo "  apps/         - Generated apps will be placed here"
    echo "  libs/         - Generated libraries will be placed here"
    echo "  template/     - Template projects"
    echo "    ├── <template_app_name>/"
    echo "    └── <template_lib_name>/"
}

# Main script logic
main() {
    # Check if we're in the right directory (has template folder)
    if [ ! -d "template" ]; then
        print_error "Template directory not found. Make sure you're running this script from the monorepo root."
        exit 1
    fi

    # Check arguments
    if [ $# -ne 2 ]; then
        show_usage
        exit 1
    fi

    local command=$1
    local project_name=$2

    # Validate project name
    if ! validate_name "$project_name"; then
        exit 1
    fi

    case $command in
        "app")
            create_app "$project_name"
            ;;
        "lib")
            create_lib "$project_name"
            ;;
        *)
            print_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"