import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const NewGroupDialog = ({ open, onOpenChange, onCreateGroup }) => {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const handleNameChange = (e: any) => {
    const newName = e.target.value
    setName(newName)
    // Auto-generate slug from name
    setSlug(newName.toLowerCase().replace(/\s+/g, '-'))
  }

  const handleSubmit = () => {
    onCreateGroup({ name, slug })
    setName('')
    setSlug('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161616] border-zinc-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-200">Create new group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-400">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              className="bg-[#161616] border-zinc-700 text-zinc-200"
              placeholder="Design"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug" className="text-zinc-400">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e: any) => setSlug(e.target.value)}
              className="bg-[#161616] border-zinc-700 text-zinc-200"
              placeholder="design"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewGroupDialog