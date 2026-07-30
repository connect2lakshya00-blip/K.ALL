"use client";

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteCourse } from '@/actions/course';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const result = await deleteCourse(courseId);
            if (result.success) {
                toast.success("Course deleted successfully");
                router.push('/courses');
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete course");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full px-4"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
                <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isDeleting ? "Deleting..." : "Delete Course"}
        </Button>
    );
}
