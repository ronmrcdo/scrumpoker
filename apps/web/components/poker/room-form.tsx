"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Plus,
  Hash,
} from "@repo/ui";
import { useRouter } from "next/navigation";
import { usePokerStore } from "@/lib/store/poker-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { generateUUID } from "@/lib/utils";

const createSchema = z.object({
  roomName: z.string().min(1, "Room name is required").max(100),
  userName: z.string().min(1, "Your name is required").max(50),
});

const joinSchema = z.object({
  roomCode: z.string().min(1, "Room code is required").max(20),
  userName: z.string().min(1, "Your name is required").max(50),
});

type CreateFormData = z.infer<typeof createSchema>;
type JoinFormData = z.infer<typeof joinSchema>;

export function RoomForm() {
  const router = useRouter();
  const createRoom = usePokerStore((s) => s.createRoom);
  const joinRoom = usePokerStore((s) => s.joinRoom);
  const setIdentity = usePokerStore((s) => s.setIdentity);
  const initChat = usePokerStore((s) => s.initChat);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { roomName: "", userName: "" },
  });

  const joinForm = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: { roomCode: "", userName: "" },
  });

  const handleCreate = async (data: CreateFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const userId = generateUUID();
      setIdentity(userId, data.userName);
      const roomId = createRoom(data.roomName, data.userName);

      if (!roomId) {
        throw new Error("Failed to create room. Please try again.");
      }

      initChat();
      router.push(`/poker/${roomId}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const handleJoin = async (data: JoinFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const userId = generateUUID();
      setIdentity(userId, data.userName);
      const roomId = joinRoom(data.roomCode, data.userName);

      if (!roomId) {
        throw new Error("Room not found. Please check the room code.");
      }

      initChat();
      router.push(`/poker/${roomId}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-soft-lg mx-2 sm:mx-0">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">MySCRUM Poker</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Create a new session or join an existing one
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 h-10">
            <TabsTrigger value="create" className="text-sm sm:text-base h-8">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Create
            </TabsTrigger>
            <TabsTrigger value="join" className="text-sm sm:text-base h-8">
              <Hash className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Join
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {formError && (
                <div className="p-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900">
                  {formError}
                </div>
              )}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="create-name" className="text-xs sm:text-sm">Your Name</Label>
                <Input
                  id="create-name"
                  placeholder="Enter your name"
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  disabled={isSubmitting}
                  {...createForm.register("userName")}
                />
                {createForm.formState.errors.userName && (
                  <p className="text-xs text-red-500">{createForm.formState.errors.userName.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="create-room" className="text-xs sm:text-sm">Room Name</Label>
                <Input
                  id="create-room"
                  placeholder="e.g., Sprint 42: API Refactoring"
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  disabled={isSubmitting}
                  {...createForm.register("roomName")}
                />
                {createForm.formState.errors.roomName && (
                  <p className="text-xs text-red-500">{createForm.formState.errors.roomName.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Room"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="join">
            <form onSubmit={joinForm.handleSubmit(handleJoin)} className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {formError && (
                <div className="p-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900">
                  {formError}
                </div>
              )}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="join-name" className="text-xs sm:text-sm">Your Name</Label>
                <Input
                  id="join-name"
                  placeholder="Enter your name"
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  disabled={isSubmitting}
                  {...joinForm.register("userName")}
                />
                {joinForm.formState.errors.userName && (
                  <p className="text-xs text-red-500">{joinForm.formState.errors.userName.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="join-code" className="text-xs sm:text-sm">Room Code</Label>
                <Input
                  id="join-code"
                  placeholder="e.g., SPR-42X"
                  className="font-mono uppercase h-10 sm:h-11 text-sm sm:text-base"
                  disabled={isSubmitting}
                  {...joinForm.register("roomCode")}
                />
                {joinForm.formState.errors.roomCode && (
                  <p className="text-xs text-red-500">{joinForm.formState.errors.roomCode.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isSubmitting}>
                {isSubmitting ? "Joining..." : "Join Room"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
