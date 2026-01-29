import { useState, useCallback } from 'react';
import { projectService } from '../../../services/projectService';
import { useAdminStore } from '../../../store/adminStore';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const { setAdminLoading, setSuccessMessage } = useAdminStore();

    const fetchProjects = useCallback(async (showOverlay = false) => {
        if (showOverlay) setAdminLoading(true, 'FETCHING REPOSITORIES');
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            if (showOverlay) setAdminLoading(false);
        }
    }, [setAdminLoading]);

    const saveProject = async (projectData) => {
        setAdminLoading(true, 'SYNCHRONIZING REPOSITORY');
        try {
            const cleanedDocs = (projectData.documentation_files || []).filter(d => d.label.trim() && d.path.trim());
            const projectToSave = { ...projectData, documentation_files: cleanedDocs.length > 0 ? cleanedDocs : null };

            let savedProject;
            if (projectData.id) {
                savedProject = await projectService.updateProject(projectData.id, projectToSave);
            } else {
                savedProject = await projectService.createProject(projectToSave);
            }

            await projectService.resequenceProjects(savedProject.id, projectToSave.display_order || 1);
            await fetchProjects(false);
            setSuccessMessage('Project successfully synchronized!');
            return true;
        } catch (err) {
            console.error('Failed to save project:', err);
            return false;
        } finally {
            setAdminLoading(false);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Delete this instance?')) return false;

        setAdminLoading(true, 'PURGING DATA');
        try {
            await projectService.deleteProject(id);
            await projectService.resequenceProjects('dummy', 9999);
            await fetchProjects(false);
            setSuccessMessage('Project successfully purged.');
            return true;
        } catch (err) {
            console.error('Failed to delete project:', err);
            return false;
        } finally {
            setAdminLoading(false);
        }
    };

    return {
        projects,
        fetchProjects,
        saveProject,
        deleteProject
    };
};
