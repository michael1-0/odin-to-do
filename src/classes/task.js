export default class Task {
    constructor(title, isDone = false, description, dueDate, priority) {
        this.title = title;
        this.isDone = isDone;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
    }
}