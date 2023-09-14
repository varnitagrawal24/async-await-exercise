const fs = require("fs");

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        // console.log(data);
        resolve(data);
      }
    });
  });
}

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        // console.log(data);
        resolve(path);
      }
    });
  });
}

function appendNewLineToFile(path, line) {
  return new Promise((resolve, reject) => {
    const content = `${line.trim()}\n`;
    fs.appendFile(path, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function deleteFile(path){
  return new Promise((resolve,reject)=>{
    fs.unlink(path,(err)=>{
      if(err){
        reject(err);
      }else{
        resolve();
      }
    })
  })
}

// functions -> do one thing and do it well

async function main() {
  try {
    const data = await readFile("./lipsum.txt");
    const dataUpper = data.toUpperCase();
    // console.log(dataUpper);
    await writeFile("uppercase.txt", dataUpper);
    console.log("dataUpper written to uppercase.txt");
    await appendNewLineToFile("filenames.txt", "./uppercase.txt");
    console.log("uppercase.txt appended to filenames.txt");
    const uppercaseDataReadFromFile = await readFile("./uppercase.txt");
    const lowercaseData = uppercaseDataReadFromFile.toLowerCase();
    console.log(lowercaseData);
    const sentences = lowercaseData.split(". ");
    const sentencesFilesPromises = sentences.map((sentence, index) => {
      return writeFile(`./data/${index}.txt`, sentence);
    });
    const sentenceFilePaths = await Promise.all(sentencesFilesPromises);
    console.log(sentenceFilePaths);
    await sentenceFilePaths.map((path) => {
      return appendNewLineToFile("filenames.txt", path);
    });

    console.log("sentence files appended to filenames.txt");

    //Q4------>

    const newFileContentPromise=sentenceFilePaths.map((path)=>{
        return readFile(path);
    })
    const newFileContent=await Promise.all(newFileContentPromise);
    console.log(newFileContent);
    newFileContent.forEach(async (content)=>{
      if(content){
        const sortedContent=content.split(" ").sort().join(" ");
        await appendNewLineToFile("./sorted.txt",sortedContent);
      }
    })
    await appendNewLineToFile("./filenames.txt","./sorted.txt");

    //Q5------>

    const filenamesContent=await readFile("./filenames.txt");
    const filePath=filenamesContent.split("\n");
    
    filePath.forEach(async(path)=>{
      if(path){
        await deleteFile(path);
      }
    })
        

  } catch (e) {
    console.error("Error: ", e);
  }
}
main();