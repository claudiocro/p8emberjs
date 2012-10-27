is_command_in_path() {
    command -v $1 > /dev/null;
}

install_npm() {
  export clean=yes
  export skipclean=no
  curl https://npmjs.org/install.sh | sh
}

curl -s -o use-node https://repository-cloudbees.forge.cloudbees.com/distributions/ci-addons/use-node
NODE_VERSION=0.7.8 \
 source ./use-node

is_command_in_path 'npm' || install_npm

mkdir -p ./jenkins-onbuild
test -f ./jenkins-onbuild/phantomjs-1.7.0-linux-i686.tar.bz2 || wget -q -P ./jenkins-onbuild http://phantomjs.googlecode.com/files/phantomjs-1.7.0-linux-i686.tar.bz2
test -f ./jenkins-onbuild/phantomjs-1.7.0-linux-i686/bin/phantomjs || tar -xf ./jenkins-onbuild/phantomjs-1.7.0-linux-i686.tar.bz2 -C ./jenkins-onbuild

export phantomjs=$(pwd)/jenkins-onbuild/phantomjs-1.7.0-linux-i686/bin
PATH=$PATH:$(pwd)/jenkins-onbuild/phantomjs-1.7.0-linux-i686/bin

npm install
npm test