Call C:\ProgramData\Anaconda3\Scripts\activate.bat C:\ProgramData\Anaconda3
Call activate python-beginner
Call conda install -c conda-forge jupyter_contrib_nbextensions 
MKDIR C:\Users\douk11ibag\AppData\Local\conda\conda\envs\python-beginner\share\jupyter\nbextensions\hide-and-teach\
CD W:
Call xcopy W:\Documents\Python\git\hide-and-teach\src C:\Users\douk11ibag\AppData\Local\conda\conda\envs\python-beginner\share\jupyter\nbextensions\hide-and-teach /S
Call jupyter contrib nbextensions install
PAUSE