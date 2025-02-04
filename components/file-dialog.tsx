import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface FileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, type: "file" | "folder") => void;
  type: "create" | "rename";
  defaultValue?: string;
  defaultType?: "file" | "folder";
}

export function FileDialog({
  open,
  onOpenChange,
  onSubmit,
  type,
  defaultValue = "",
  defaultType = "file",
}: FileDialogProps) {
  const [name, setName] = useState(defaultValue);
  const [itemType, setItemType] = useState<"file" | "folder">(defaultType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name, itemType);
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Create New" : "Rename"} {itemType}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder={`Enter ${itemType} name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {type === "create" && (
            <RadioGroup
              defaultValue={itemType}
              onValueChange={(value) => setItemType(value as "file" | "folder")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file">File</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="folder" id="folder" />
                <Label htmlFor="folder">Folder</Label>
              </div>
            </RadioGroup>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {type === "create" ? "Create" : "Rename"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
