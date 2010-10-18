set :stages, %w(production qa)
set :default_stage, "qa"

require 'capistrano/ext/multistage'

depend :remote, :command, "gem"
depend :remote, :gem, :rake, ">=0.8.1"

set :application, 'atnmanager'
set :use_sudo, false
set :runner, 'webdev'

# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the :deploy_to variable:
set :deploy_to, "/www/#{application}"

# If you aren't using Subversion to manage your source code, specify
# your SCM below:
set :scm, :git
# Remote caching will keep a local git repo on the server you're deploying to and simply run a fetch from that rather than an entire clone. This is probably the best option and will only fetch the differences each deploy
#
#set :remote_cache, "git-cache"
#set :deploy_via, :remote_cache
set :git_enable_submodules, 1
set :repository,  "git://gitorious.gina.alaska.edu/atn/manager.git"
#set :branch, "deploy"
set :rails_env, 'production'

task :after_update_code do
  run "mkdir -p #{deploy_to}/#{shared_dir}/config"
  run "ln -nfs #{deploy_to}/#{shared_dir}/config/database.yml #{release_path}/config/database.yml"
  run "ln -nfs #{deploy_to}/#{shared_dir}/config/settings.yml #{release_path}/config/settings.yml"
end

namespace :deploy do
  desc "Restart task for passenger"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

