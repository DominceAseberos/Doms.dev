
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(PROJECT_ROOT, 'src/data/portfolioData.json');

const escapeSql = (val) => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`; // JSONB
    return `'${String(val).replace(/'/g, "''")}'`;
};

async function main() {
    // Read JSON data
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    let sql = '';

    // 1. Sync Profile
    const profileData = {
        name: data.profile.name,
        role: data.profile.role,
        occupation: data.profile.role,
        bio: data.profile.bio,
        location: data.profile.location,
        avatar_url: data.profile.avatar,
        github_username: data.profile.githubUsername
    };

    sql += `-- Sync Profile\n`;
    sql += `UPDATE profiles SET \n`;
    sql += `  name = ${escapeSql(profileData.name)},\n`;
    sql += `  role = ${escapeSql(profileData.role)},\n`;
    sql += `  bio = ${escapeSql(profileData.bio)},\n`;
    sql += `  location = ${escapeSql(profileData.location)},\n`;
    sql += `  avatar_url = ${escapeSql(profileData.avatar_url)},\n`;
    sql += `  github_username = ${escapeSql(profileData.github_username)}\n`;
    sql += `WHERE id IS NOT NULL;\n\n`;

    // 2. Sync Education
    const eduData = {
        school: data.education.school,
        degree: data.education.degree,
        level: data.education.level,
        year_level: data.education.yearLevel,
        logo_url: data.education.logo
    };

    sql += `-- Sync Education\n`;
    sql += `UPDATE education SET \n`;
    sql += `  school = ${escapeSql(eduData.school)},\n`;
    sql += `  degree = ${escapeSql(eduData.degree)},\n`;
    sql += `  level = ${escapeSql(eduData.level)},\n`;
    sql += `  year_level = ${escapeSql(eduData.year_level)},\n`;
    sql += `  logo_url = ${escapeSql(eduData.logo_url)}\n`;
    sql += `WHERE id IS NOT NULL;\n\n`;

    // 3. Sync Contacts
    const contactData = {
        email: data.contacts.email,
        github: data.contacts.github,
        linkedin: data.contacts.linkedin,
        facebook: data.contacts.facebook,
        messenger: data.contacts.messenger
    };

    sql += `-- Sync Contacts\n`;
    sql += `UPDATE contacts SET \n`;
    sql += `  email = ${escapeSql(contactData.email)},\n`;
    sql += `  github = ${escapeSql(contactData.github)},\n`;
    sql += `  linkedin = ${escapeSql(contactData.linkedin)},\n`;
    sql += `  facebook = ${escapeSql(contactData.facebook)},\n`;
    sql += `  messenger = ${escapeSql(contactData.messenger)}\n`;
    sql += `WHERE id IS NOT NULL;\n\n`;

    // 4. Sync Tech Stack
    sql += `-- Sync Tech Stack\n`;
    for (const [index, tech] of data.techStack.entries()) {
        const payload = {
            name: tech.name,
            icon_name: tech.iconName || tech.name,
            type: tech.type,
            color: tech.color,
            display_order: index + 1
        };

        // REMOVED OVERRIDING SYSTEM VALUE
        sql += `INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (\n`;
        sql += `  ${escapeSql(payload.name)}, ${escapeSql(payload.icon_name)}, ${escapeSql(payload.type)}, ${escapeSql(payload.color)}, ${escapeSql(payload.display_order)}\n`;
        sql += `) ON CONFLICT (name) DO UPDATE SET \n`;
        sql += `  icon_name = EXCLUDED.icon_name,\n`;
        sql += `  type = EXCLUDED.type,\n`;
        sql += `  color = EXCLUDED.color,\n`;
        sql += `  display_order = EXCLUDED.display_order;\n\n`;
    }

    // 5. Sync Projects
    sql += `-- Sync Projects\n`;
    for (const [index, project] of data.projects.entries()) {
        const payload = {
            id: project.id,
            title: project.title,
            short_description: project.shortDescription,
            project_type: project.projectType,
            date_created: project.dateCreated,
            image_url: project.image,
            images: project.images,
            stacks: project.stacks,
            live_preview_link: project.livePreviewLink,
            github_link: project.githubLink,
            full_documentation: project.fullDocumentation,
            documentation_files: project.documentationFiles,
            display_order: index + 1
        };

        // REMOVED OVERRIDING SYSTEM VALUE
        sql += `INSERT INTO projects (id, title, short_description, project_type, date_created, image_url, images, stacks, live_preview_link, github_link, full_documentation, documentation_files, display_order) VALUES (\n`;
        sql += `  ${escapeSql(payload.id)}, ${escapeSql(payload.title)}, ${escapeSql(payload.short_description)}, ${escapeSql(payload.project_type)}, ${escapeSql(payload.date_created)}, ${escapeSql(payload.image_url)}, ${escapeSql(payload.images)}, ${escapeSql(payload.stacks)}, ${escapeSql(payload.live_preview_link)}, ${escapeSql(payload.github_link)}, ${escapeSql(payload.full_documentation)}, ${escapeSql(payload.documentation_files)}, ${escapeSql(payload.display_order)}\n`;
        sql += `) ON CONFLICT (id) DO UPDATE SET \n`;
        sql += `  title = EXCLUDED.title,\n`;
        sql += `  short_description = EXCLUDED.short_description,\n`;
        sql += `  project_type = EXCLUDED.project_type,\n`;
        sql += `  date_created = EXCLUDED.date_created,\n`;
        sql += `  image_url = EXCLUDED.image_url,\n`;
        sql += `  images = EXCLUDED.images,\n`;
        sql += `  stacks = EXCLUDED.stacks,\n`;
        sql += `  live_preview_link = EXCLUDED.live_preview_link,\n`;
        sql += `  github_link = EXCLUDED.github_link,\n`;
        sql += `  full_documentation = EXCLUDED.full_documentation,\n`;
        sql += `  documentation_files = EXCLUDED.documentation_files,\n`;
        sql += `  display_order = EXCLUDED.display_order;\n\n`;
    }

    console.log(sql);
}

main();
