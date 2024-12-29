import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}

const NewGroupDialog: React.FC<NewGroupDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-zinc-400">Create new group</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#161616] border-zinc-700 text-zinc-400"
              placeholder="Enter group name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent hover:bg-zinc-800 text-zinc-400 border-none hover:text-zinc-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#161616] text-zinc-400 hover:bg-zinc-800"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupDialog;