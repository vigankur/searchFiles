
const { dir } = require("console");
const fs = require("fs");
const path = require("path");
const keyword = process.argv[2];
var dirPath = path.join(__dirname, '');

/**
* Function that reads a file in streams/chunks and searches for keyword in the file
* @author   John
* @param    {String} keyword        search text keyword
* @param    {String} dirPath        Path of file/directory
* @param    {array} arrayOfFiles    List of absolute paths of files
* @return   {<Promise>}             Promise resolving with array of files' absolute paths
*/
getAllFiles = function (keyword, dirPath = __dirname, arrayOfFiles = []) {
    try {
        if (!keyword || !keyword.trim())
            return Promise.reject("in getAllFiles() : " + "Keyword to search not entered ");
        else
            keyword = keyword.toUpperCase();

        if (dirPath === '' || !fs.existsSync(dirPath))
            return Promise.reject("in getAllFiles() : " + "Directory not found " + dirPath);
        else {
            files = fs.readdirSync(dirPath)
            if (!Array.isArray(files) || files.length === 0)
                Promise.resolve()

            return files.reduce(function (acc, cur) {
                return acc.then((arrayOfFiles) => searchTextInFile(keyword, dirPath, cur, arrayOfFiles))
            }, Promise.resolve(arrayOfFiles));

        }
    } catch (err) {
        return Promise.reject(err);
    }
}

/**
* Function that reads a file in streams/chunks and searches for keyword in the file
* @author   John
* @param    {String} keyword        search text keyword
* @param    {String} dirPath        Path of file/directory
* @param    {array} arrayOfFiles    List of absolute paths of files
* @return   {<Promise>}             Promise resolving with array of files' absolute paths
*/
searchTextInFile = function (keyword, dirPath, file, arrayOfFiles) {
    return new Promise((resolve, reject) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file == "node_modules") {
                console.log("[EXCLUDED]------------------------- ", file);
                resolve(arrayOfFiles);
            }
            else
                resolve(getAllFiles(keyword, dirPath + "/" + file, arrayOfFiles))
        } else {
            if (!!file.toUpperCase().endsWith(".JS")) {
                var readStream = fs.createReadStream(dirPath + "/" + file, { encoding: "utf8" });
                readStream
                    .on("data", function (chunk) {
                        if (chunk.toUpperCase().indexOf(keyword) > -1) {
                            console.info(path.join(dirPath, "/", file))
                            arrayOfFiles.push(path.join(dirPath, "/", file))
                            readStream.destroy();
                            resolve(arrayOfFiles);
                        }
                        else
                            resolve(arrayOfFiles);
                    })
                    .on("end", function () {
                        resolve(arrayOfFiles);
                    })
                    .on("close", function (err) {
                        resolve(arrayOfFiles);
                    })
                    .on("error", function (err) {
                        reject("in searchTextInFile() : " + err.message);
                    });
            }
            else
                resolve(arrayOfFiles);
        }
    })
        .catch(function (err) {
            return Promise.reject(err)
        });
}

/**
* Function that writes the results to a file
* @author   Ankur
* @param    {array} arrayOfFiles    List of absolute paths of files
* @return   {<Promise>}             Resolve/Reject
*/
writeResult = function (arrayOfFiles) {
    return new Promise((resolve, reject) => {
        let destPath = path.join(dirPath, "results.js")
        return fs.writeFile(
            destPath,
            arrayOfFiles.length > 0 ? arrayOfFiles.join("\n") : "No files found.",
            function (err, datas) {
                if (err) {
                    reject(err);
                }
                else {
                    console.log("\nThe results are stored at location: ", destPath, "\n")
                    resolve();
                }
            }
        )
    })
        .catch((err) => {
            console.log(err);
            Promise.reject("in writeResult() : " + err);
        });
}

// main calling starts here
getAllFiles(keyword, dirPath)
    .then((arrayOfFiles) => writeResult(arrayOfFiles))
    .catch((err) => console.log('Error occurred', err, '\n--------Program terminated.--------'));

module.exports = {
    getAllFiles: getAllFiles,
    searchTextInFile: searchTextInFile,
    writeResult: writeResult
}