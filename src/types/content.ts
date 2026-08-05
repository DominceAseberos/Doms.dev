export interface PortfolioProject { id:string; title:string; shortDescription:string; projectType:string; dateCreated:string; liveUrl?:string; githubUrl?:string; featuredInTunnel?:boolean; mainImage?:string; }
export interface PortfolioData { categories:string[]; customCategories?:string[]; projects:PortfolioProject[]; }
