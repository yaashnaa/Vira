# Setting up NVM
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm


# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/yashna/Desktop/anaconda3/bin/conda' 'shell.zsh' 
'hook')"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/yashna/Desktop/anaconda3/etc/profile.d/conda.sh" ]; 
then
        . "/Users/yashna/Desktop/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/yashna/Desktop/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

