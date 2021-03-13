const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));
const mock = require('mock-fs');
const FileSystem = require("mock-fs/lib/filesystem");
const searchFiles = require('./searchFiles');

describe('script', () => {
    before(() => {
        mock({
            test: {
                'index.js': '# Hello todo world!',
                model: {
                    path: {
                        to: {
                            userModel: {
                                "file_with_todo.js": 'text content has TODO',
                                "file_without_todo.js": Buffer.from([1, 2, 3, 4])
                            },
                            adminModel: {
                                "file_with_todo.js": 'text content has TODO',
                                "file_without_todo.js": 'text content does not have T O D O'
                            }
                        }
                    }
                },
                view: {
                    pathToViews: {
                        "view1.jsx": 'text content has jsx code only',
                        "view2.jsx": Buffer.from([1, 2, 3, 4]),
                        "pending.js": 'Pending TODO tasks'
                    }
                },
                controller: {
                    "file_with_todo.js": 'text content has TODO',
                    "file_without_todo.js": Buffer.from([5, 8, 3, 0])
                }
            },
        });
    });

    after(() => {
        mock.restore();
    });

    it('getAllFiles(): list all resulting files with keyword TODO', function () {
        const expectedResult = [
            '/Users/avig/Desktop/SearchFiles/test/index.js',
            '/Users/avig/Desktop/SearchFiles/test/model/path/to/adminModel/file_with_todo.js',
            '/Users/avig/Desktop/SearchFiles/test/model/path/to/userModel/file_with_todo.js',
            '/Users/avig/Desktop/SearchFiles/test/view/pathToViews/pending.js',
            '/Users/avig/Desktop/SearchFiles/test/controller/file_with_todo.js'
        ]
        const keyword = 'todo';
        const dirPath = `${__dirname}/test`;
        return searchFiles.getAllFiles(keyword, dirPath)
            .then((arrayOfFiles) => {
                expect(arrayOfFiles).to.have.all.members(expectedResult);
            })
    })

    it('getAllFiles(): throw error when Directory not found', function () {
        const expectedResult = 'in getAllFiles() : Directory not found /Users/avig/Desktop/SearchFiles/testerClass';
        const keyword = 'todo';
        const dirPath = `${__dirname}/testerClass`;
        return searchFiles.getAllFiles(keyword, dirPath)
            .catch(function (res) {
                expect(res).to.equal(expectedResult)
            })
    })

    it('getAllFiles(): throw error when keyword not entered', function () {
        const expectedResult = 'in getAllFiles() : Keyword to search not entered ';
        const keyword = '';
        const dirPath = `${__dirname}/test`;
        return searchFiles.getAllFiles(keyword, dirPath)
            .catch(function (res) {
                expect(res).to.equal(expectedResult)
            })
    })

    it('getAllFiles(): No resulting files with keyword T0D0', function () {
        const expectedResult = []
        const keyword = 't0d0';
        const dirPath = `${__dirname}/test`;
        return searchFiles.getAllFiles(keyword, dirPath)
            .then((arrayOfFiles) => {
                expect(arrayOfFiles).to.have.all.members(expectedResult);
            })
    })

    it('writeResult(): write array of file paths to result file and then read the file', function () {
        const inputArray = [
            '/Users/avig/Desktop/SearchFiles/test/view/pathToViews/pending.js',
            '/Users/avig/Desktop/SearchFiles/test/controller/file_with_todo.js'
        ];
        const expectedResult = '/Users/avig/Desktop/SearchFiles/test/view/pathToViews/pending.js\n/Users/avig/Desktop/SearchFiles/test/controller/file_with_todo.js';
        const keyword = 't0d0';
        const dirPath = `${__dirname}/test`;
        const destFile = `${__dirname}/results.js`
        return expect(searchFiles.writeResult(inputArray).then(() => {
            return fs.readFileSync(destFile, 'utf8');
        })).to.eventually.equal(expectedResult);
    })
});