 export type projectType={
    id:number,
    projectId:string,
    device:string,
    userInput:string,
    createdOn:string,
    projectName?:string,
    theme?:string,
    screenshot?:string,
}

export type screenConfig={
    id:number,
    screenId:string,
    screenName:string,
    purpose:string,
    screenConfiguration:string,
    screenDescription:string,
    code?:string,
}

