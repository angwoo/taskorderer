const fs = require('fs');
const args = process.argv.slice(2);
let file = JSON.parse(fs.readFileSync(args[0]));

/**
 * @param {object}  current        Current task, used to find next task under after current. if null find first without previousid
 * @param {array}   tasks          List of possible next tasks
 * @param {array}   list           Array to add next task to the end of
 * @param {string}  parent         ParentID, get next task only for parentID, optional
 */

function getNext(current, tasks, list = [], parent = undefined) {
    //check if there is any tasks left and return list if there is none
    if (tasks.length === 0) {
        return list
    }
    //get next task or first task if current is null
    let task = tasks.filter(task => task.previousID === (current ? current.ID : undefined) && task.parentID === parent)[0]
    //check if there is was no task found and return list if there is none
    if (!task) {
        return list
    }
    //get next task for current task and get sub tasks for current task
    return getNext(task, tasks.filter(t => t.ID !== task.ID), [...list, { task: task, subTasks: getNext(null, tasks.filter(t => t.ID !== task.ID), [], task.ID) }], parent)
}

//write ordered tasks to file
const tasksOrdered = JSON.stringify(getNext(null, file, []), null, 2);
fs.writeFileSync(args[1], tasksOrdered);