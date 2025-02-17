export const projects : Project[] = [];

export class Project {
    constructor(
        public id: string,
        public leader: string,
        public name: string,
        public hours: number,
        public startDate: Date,
        public endDate: Date,
        public description: string,
        public status: string,
        public progress: string,
        public team: string[],
        public PM: string
    ) {
        this.id = id;
        this.name = name;
        this.hours = hours;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.status = status;
        this.progress = progress;
        this.team = team;
        this.PM = PM;
    }

    public static save(project: Project) {
        projects.push(project);
    }

    public static getProjects(leader: string) {
        return projects.filter((project) => (project.leader === leader) || (project.team.includes(leader)));
    }
    
}   


