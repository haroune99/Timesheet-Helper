export interface Project {
    consultant: string;
    name: string;
    hours: number;
    startDate: Date;
    endDate: Date;
    description: string;
    status: string;
    progress: string;
    team: string[];
    PM: string;
    _id?: string;
}
export declare class Project implements Project {
    consultant: string;
    name: string;
    hours: number;
    startDate: Date;
    endDate: Date;
    description: string;
    status: string;
    progress: string;
    team: string[];
    PM: string;
    _id?: string | undefined;
    constructor(consultant: string, name: string, hours: number, startDate: Date, endDate: Date, description: string, status: string, progress: string, team: string[], PM: string, _id?: string | undefined);
    static save(project: Project): Promise<void>;
    static getConsultantProjects(consultant: string): Promise<Project[]>;
    static updateProject(id: string, updateData: Partial<Project>): Promise<void>;
    static deleteProject(id: string): Promise<void>;
}
//# sourceMappingURL=Project.d.ts.map