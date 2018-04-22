import conda.cli

conda.cli.main('conda', 'install',  '-y', 'numpy')
conda.cli.main('conda', 'install', '-c', 'menpo', 'opencv3')
conda.cli.main('conda', 'install', '-c', 'anaconda', 'requests')