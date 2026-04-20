import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "../services/projectService";

// Async thunks
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const response = await projectService.getAllProjects();
    return response.data;
});

export const createProject = createAsyncThunk('projects/createProject', async (projectData) => {
    const response = await projectService.createProject(projectData);
    return response.data;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({id, projectData}) => {
    const response = await projectService.updateProject(id, projectData);
    return response.data;
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id) => {
    await projectService.deleteProject(id);
    return id;
});

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        filteredProjects: [],
        status: 'idle',
        error: null,
        searchTerm: ''
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.filteredProjects = state.projects.filter(project =>
                project.title.toLowerCase().includes(action.payload.toLowerCase()) ||
                project.description.toLowerCase().includes(action.payload.toLowerCase())
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects = action.payload;
                state.filteredProjects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
                state.filteredProjects = state.projects.filter(project =>
                    project.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(state.searchTerm.toLowerCase())
                );
            })
            .addCase(createProject.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(project => 
                    (project.id || project._id) === (action.payload.id || action.payload._id)
                );
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                state.filteredProjects = state.projects.filter(project =>
                    project.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(state.searchTerm.toLowerCase())
                );
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(project => 
                    (project.id || project._id) !== action.payload
                );
                state.filteredProjects = state.projects.filter(project =>
                    project.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(state.searchTerm.toLowerCase())
                );
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export const { clearError, setSearchTerm } = projectSlice.actions;
export default projectSlice.reducer;