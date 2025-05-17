"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Code2,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  Clock,
  Layers,
  Search,
  MoreVertical,
  Star,
  StarOff,
  Calendar,
  Filter,
} from "lucide-react";
import { redirect } from "next/navigation";
import Logo from "@/components/logo";
import { fileSystem, FileNode } from "@/lib/file-system";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<FileNode[]>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState({
    name: "",
    description: "",
    category: "",
  });

  // Fetch projects from file system
  useEffect(() => {
    function updateProjects() {
      const rootFolders = fileSystem
        .getFiles()
        .filter((f) => f.type === "folder");
      setProjects(rootFolders);
    }
    updateProjects();
    const unsubscribe = fileSystem.onFileSystemChange(updateProjects);
    return () => unsubscribe();
  }, []);

  // Redirect if not logged in
  if (status !== "loading" && !session) {
    redirect("/signin");
  }

  // Create project (folder at root)
  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    setLoading(true);
    try {
      // Check for duplicate
      if (projects.some((p) => p.name === newProject.name)) {
        toast.error("A project with this name already exists");
        setLoading(false);
        return;
      }
      const folder = fileSystem.createFolder(null, newProject.name.trim());
      // Store metadata in folder node
      folder.description = newProject.description;
      folder.category = newProject.category;
      folder.isStarred = false;
      folder.collaborators = 1;
      fileSystem.rename(folder.id, newProject.name.trim()); // To trigger update
      toast.success("Project created");
      setNewProject({ name: "", description: "", category: "" });
      setIsDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  // Delete project (folder)
  const handleDeleteProject = (id: string) => {
    setLoading(true);
    try {
      fileSystem.delete(id);
      toast.success("Project deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  // Star/unstar project
  const handleToggleStar = (id: string) => {
    const folder = fileSystem.findNode(id);
    if (folder) {
      folder.isStarred = !folder.isStarred;
      fileSystem.rename(folder.id, folder.name); // To trigger update
    }
  };

  // Edit project (metadata)
  const handleEditProject = (project: FileNode) => {
    setEditingProjectId(project.id);
    setEditProject({
      name: project.name,
      description: project.description || "",
      category: project.category || "",
    });
  };
  const handleSaveEditProject = () => {
    if (!editingProjectId) return;
    const folder = fileSystem.findNode(editingProjectId);
    if (folder) {
      folder.name = editProject.name;
      folder.description = editProject.description;
      folder.category = editProject.category;
      fileSystem.rename(folder.id, editProject.name);
      toast.success("Project updated");
    }
    setEditingProjectId(null);
  };

  // Filtered and searched projects
  const filteredProjects = projects
    .filter((project) => {
      if (filter === "starred") return project.isStarred;
      return true;
    })
    .filter((project) => {
      if (searchQuery) {
        return (
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (project.category || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl flex items-top justify-center">
              <Logo />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground">
                Manage and collaborate on your coding projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Input
                placeholder="Search projects..."
                className="pl-9 bg-background/40 backdrop-blur-md border-white/10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary/90 hover:bg-primary">
                  <Plus className="h-4 w-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-background/60 border-white/20">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Create a new project to collaborate with others.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Project name"
                      className="col-span-3 bg-background/40 backdrop-blur-md border-white/10"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      placeholder="Web Development, Mobile, etc."
                      className="col-span-3 bg-background/40 backdrop-blur-md border-white/10"
                      value={newProject.category}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          category: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Project description"
                      className="col-span-3 bg-background/40 backdrop-blur-md border-white/10"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-white/10 hover:bg-background/60"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={loading}>
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Project Dialog */}
            <Dialog
              open={!!editingProjectId}
              onOpenChange={() => setEditingProjectId(null)}
            >
              <DialogContent className="backdrop-blur-xl bg-background/60 border-white/20">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update your project details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="Project name"
                      className="col-span-3 bg-background/40 backdrop-blur-md border-white/10"
                      value={editProject.name}
                      onChange={(e) =>
                        setEditProject({ ...editProject, name: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="edit-category"
                      placeholder="Web Development, Mobile, etc."
                      className="col-span-3 bg-background/40 backdrop-blur-md border-white/10"
                      value={editProject.category}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          category: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      placeholder="Project description"
                      className="col-span-3 bg-background/40 backdrop-blur-md border-white/10"
                      value={editProject.description}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          description: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProjectId(null)}
                    className="border-white/10 hover:bg-background/60"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEditProject} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter !== "all"
                  ? "border-white/10 bg-background/40 backdrop-blur-md"
                  : ""
              }
              size="sm"
            >
              All Projects
            </Button>
            <Button
              variant={filter === "starred" ? "default" : "outline"}
              onClick={() => setFilter("starred")}
              className={
                filter !== "starred"
                  ? "border-white/10 bg-background/40 backdrop-blur-md"
                  : ""
              }
              size="sm"
            >
              <Star className="h-4 w-4 mr-1" /> Starred
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-background/40 backdrop-blur-md"
              size="sm"
            >
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
              className={
                view !== "grid"
                  ? "border-white/10 bg-background/40 backdrop-blur-md"
                  : ""
              }
              size="sm"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className={
                view !== "list"
                  ? "border-white/10 bg-background/40 backdrop-blur-md"
                  : ""
              }
              size="sm"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-24 w-24 rounded-full bg-background/40 backdrop-blur-md flex items-center justify-center mb-4">
              <Layers className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              Create a new project to get started
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="relative backdrop-blur-xl bg-background/30 border border-white/10 overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${project.isStarred ? "bg-primary/20" : "bg-muted/30"} flex items-center justify-center`}
                      >
                        <Code2
                          className={`h-5 w-5 ${project.isStarred ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {project.name}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary"
                            onClick={() => handleToggleStar(project.id)}
                          >
                            {project.isStarred ? (
                              <Star className="h-4 w-4 text-primary" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1 text-muted-foreground hover:text-primary"
                            onClick={() => handleEditProject(project)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                            {project.category}
                          </span>
                        </CardDescription>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      <span>{project.collaborators || 1} collaborators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        Updated{" "}
                        {project.updatedAt
                          ? new Date(project.updatedAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-white/5 pt-4 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 bg-background/40 backdrop-blur-md hover:bg-background/60"
                    asChild
                  >
                    <Link href={`/editor?projectId=${project.id}`}>
                      Open <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary/90 hover:bg-primary"
                    asChild
                  >
                    <Link href={`/editor?projectId=${project.id}`}>
                      Collaborate <Users className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="relative backdrop-blur-xl bg-background/30 border border-white/10 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg ${project.isStarred ? "bg-primary/20" : "bg-muted/30"} flex-shrink-0 flex items-center justify-center`}
                    >
                      <Code2
                        className={`h-6 w-6 ${project.isStarred ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium">{project.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary"
                          onClick={() => handleToggleStar(project.id)}
                        >
                          {project.isStarred ? (
                            <Star className="h-4 w-4 text-primary" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1 text-muted-foreground hover:text-primary"
                          onClick={() => handleEditProject(project)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                          {project.category}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Created{" "}
                            {project.createdAt
                              ? new Date(project.createdAt).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Updated{" "}
                            {project.updatedAt
                              ? new Date(project.updatedAt).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>
                            {project.collaborators || 1} collaborators
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-end sm:justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 bg-background/40 backdrop-blur-md hover:bg-background/60"
                      asChild
                    >
                      <Link href={`/editor?projectId=${project.id}`}>
                        Open <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Home Link */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
