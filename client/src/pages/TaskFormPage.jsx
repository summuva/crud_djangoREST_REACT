import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { createTask, DeleteTask, updateTask, getTask } from '../api/tasks.api';
import { useNavigate, useParams } from "react-router-dom";

/**
 * TasksFormPage Component
 * This component provides a form to create or update tasks.
 * It uses react-hook-form for form handling and react-router-dom for navigation and URL parameters.
 */
export function TasksFormPage() {

    // Initialize useForm with methods for form handling
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();  // Hook for programmatic navigation
    const params = useParams();      // Hook to access URL parameters

    /**
     * Form submission handler
     * - If there's an 'id' parameter, update the existing task
     * - Otherwise, create a new task
     * - After the operation, navigate back to the tasks list
     */
    const onSubmit = handleSubmit(async data => {
        if (params.id) {
            await updateTask(params.id, data);  // Update task if 'id' exists
        } else {
            await createTask(data);  // Create a new task if 'id' doesn't exist
        }
        navigate("/tasks");  // Redirect to the tasks list
    });

    /**
     * useEffect hook to load task data if 'id' parameter exists
     * - Fetches task data and populates the form fields using setValue
     */
    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                console.log("Fetching task data");
                const res = await getTask(params.id);
                setValue('title', res.data.title);           // Set form title field
                setValue('description', res.data.description);  // Set form description field
            }
        }
        loadTask();  // Call the async function to load task
    }, [params.id, setValue]);

    return (
        <form onSubmit={onSubmit}>
            {/* Input field for task title */}
            <input 
                type="text" 
                placeholder="Title"
                {...register('title', { required: true })} 
            />
            {errors.title && <span>This field is required</span>}  {/* Error message for title field */}

            {/* Textarea for task description */}
            <textarea 
                rows="3" 
                placeholder="Description"
                {...register('description', { required: true })}
            ></textarea>
            {errors.description && <span>This field is required</span>}  {/* Error message for description field */}

            <button type="submit">Save</button>  {/* Submit button */}
            
            {/* Conditionally render the Delete button if 'id' exists */}
            {params.id && (
                <button 
                    type="button" 
                    onClick={async () => {
                        const accepted = window.confirm("Are you sure?");
                        if (accepted) {
                            await DeleteTask(params.id);  // Delete the task if confirmed
                            navigate("/tasks");  // Redirect to tasks list
                        }
                    }}
                >
                    Delete
                </button>
            )}
        </form>
    );
}
