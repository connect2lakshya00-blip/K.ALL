"use client";

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteQuiz } from '@/actions/quiz';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteQuizButtonProps {
    quizId: string;
    onSuccess?: () => void;
    redirectTo?: string;
    className?: string;
    variant?: "ghost" | "destructive" | "default" | "outline" | "secondary" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    showText?: boolean;
}

export default function DeleteQuizButton({ 
    quizId, 
    onSuccess, 
    redirectTo, 
    className,
    variant = "ghost",
    size = "sm",
    showText = true
}: DeleteQuizButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteQuiz(quizId);
            if (result.success) {
                toast.success("Quiz deleted successfully");
                if (onSuccess) onSuccess();
                if (redirectTo) {
                    router.push(redirectTo);
                }
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete quiz");
            setShowConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(false);
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg"
                >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    Confirm
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isDeleting}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/5 rounded-lg"
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <Button 
            variant={variant}
            size={size} 
            onClick={handleDelete}
            disabled={isDeleting}
            className={className || "text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full"}
            title="Delete Quiz"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
            {showText && (
                 <span className="ml-2">{isDeleting ? "Deleting..." : "Delete Quiz"}</span>
            )}
        </Button>
    );
}
