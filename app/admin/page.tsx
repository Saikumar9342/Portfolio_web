"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useProjects } from "@/hooks/useProjects";

export default function AdminPage() {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { projects, loading } = useProjects();

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message;
        return String(error);
    };
    const toast = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: unknown) {
            toast.push(getErrorMessage(error));
        }
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.push("Please provide a title and description.");
            return;
        }

        try {
            await addDoc(collection(db, "projects"), {
                title,
                description,
                techStack: techStack.split(",").map(t => t.trim()),
                liveLink,
                githubLink,
                imageUrl,
                createdAt: serverTimestamp()
            });
            // Clear form
            setTitle("");
            setDescription("");
            setTechStack("");
            setLiveLink("");
            setGithubLink("");
            setImageUrl("");
            toast.push("Project added");
        } catch (error: unknown) {
            toast.push(getErrorMessage(error));
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            await deleteDoc(doc(db, "projects", id));
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                    <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                    />
                    <Button type="submit" className="w-full" variant="glass">Login</Button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Button onClick={() => signOut(auth)} variant="ghost">Logout</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Add Project Form */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-fit">
                        <h2 className="text-xl font-semibold mb-6">Add New Project</h2>
                        <form onSubmit={handleAddProject} className="space-y-4">
                            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                                placeholder="Description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <Input placeholder="Tech Stack (comma separated)" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
                            <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                            <Input placeholder="Live Link" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
                            <Input placeholder="GitHub Link" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
                            <Button type="submit" className="w-full" variant="glass">Add Project</Button>
                        </form>
                    </div>

                    {/* Project List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-6">Manage Projects</h2>
                        {projects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                <div>
                                    <p className="font-medium">{project.title}</p>
                                    <p className="text-xs text-gray-400">{project.techStack.join(", ")}</p>
                                </div>
                                <Button onClick={() => handleDelete(project.id)} variant="ghost" className="text-red-400 hover:text-red-300">Delete</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
