# searchFiles.js

It's simple nodejs application that when executed in a directory, searches for and produces a list of all files in the present working directory (using their absolute paths) containing the keyword `"TODO"` in them. The files can be in the immediate directory, or nested infinitely.

Steps:
1. Clone the git repository
2. cd SearchFiles
3. npm i
4. To Run program------: npm start
5. To run test cases---: npm test

Note:
- The program searches and displays only .js files containing the keyword.
- The large files are read in streams/chunks and searched for keyword, if found the reading is stopped for that file and moves to next file.
- The result containing all files will be displayed on the console live as the program is running.
- The final list of all searched files will be saved in results.js file inside the parent directory.


# searchFiles.test.js

Third-party libraries used for testing:
- Mocha
- Chai
- chai-as-promised
- mock-fs

# Example
Given the following directory structure:

```
/path/to/your/dir
  - somedir
    - somemodule
      - somefile.js
      - someotherfile.js
  - somedir2
    - anotherdir
      - yet_another_dir
        - index.js
      - index.js
    - index.js
  - somedir3
    - another_file.js
```

Assuming your application runs at `/path/to/your/dir`, and assuming all of the files contains the text string `"TODO"`, the application will output something similar to:

```
/path/to/your/dir/somedir/somemodule/somefile.js
/path/to/your/dir/somedir/somemodule/someotherfile.js
/path/to/your/dir/somedir2/anotherdir/yet_another_dir/index.js
/path/to/your/dir/somedir2/anotherdir/index.js
/path/to/your/dir/somedir2/index.js
/path/to/your/dir/somedir3/another_file.js
The results are stored at location:  /path/to/your/dir/results.js
```
