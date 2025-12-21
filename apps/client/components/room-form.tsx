"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Award01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	type CreateRoomSchema,
	createRoomSchema,
	type JoinRoomSchema,
	joinRoomSchema,
} from "@/schema";
import { socketCommands } from "@/socket/commands";

import Button from "./shared/button";
import Card from "./shared/card";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function RoomForm() {
	const actionRef = useRef<"create" | "join">("create");
	const [error, setError] = useState<string | null>(null);

	const form = useForm<CreateRoomSchema>({
		resolver: (data, context, options) => {
			const schema =
				actionRef.current === "create" ? createRoomSchema : joinRoomSchema;
			return zodResolver(schema)(data, context, options);
		},
		defaultValues: {
			code: "",
			name: "",
		},
	});

	const handleSubmit = (values: CreateRoomSchema | JoinRoomSchema) => {
		setError(null);
		if (actionRef.current === "create") {
			socketCommands.createRoom(values.name);
		} else if (joinRoomSchema.safeParse(values).success) {
			socketCommands.joinRoom(
				(values as JoinRoomSchema).code,
				values.name,
				(res) => {
					if (res?.error) {
						setError(res.error.message);
					}
				},
			);
		}
	};

	return (
		<Card className="w-full max-w-md p-8 shadow-lg">
			<div className="flex flex-col items-center space-y-2 mb-8">
				<div className="p-3 bg-primary rounded-xl">
					<HugeiconsIcon
						icon={Award01Icon}
						className="w-8 h-8 text-primary-foreground"
					/>
				</div>
				<h1 className="text-3xl font-extrabold tracking-light text-foreground">
					Scrum Poker
				</h1>
			</div>

			{!!error && (
				<div className="grid w-full max-w-xl items-start gap-4 my-4">
					<Alert variant="destructive">
						<HugeiconsIcon icon={AlertCircleIcon} className="w-8 h-8" />
						<AlertTitle>{error}!</AlertTitle>
					</Alert>
				</div>
			)}

			<form
				id="join-room-form"
				className="space-y-6"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<div className="space-y-2">
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="join-room-name-input">Name</FieldLabel>
								<Input
									{...field}
									id="join-room-name-input"
									aria-invalid={fieldState.invalid}
									placeholder="Player name"
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<div className="space-y-2">
					<Controller
						name="code"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="join-room-code-input">Code</FieldLabel>
								<Input
									{...field}
									id="join-room-code-input"
									aria-invalid={fieldState.invalid}
									placeholder="Code to join room"
									autoComplete="off"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4 pt-4">
					<Button
						type="submit"
						onClick={() => {
							actionRef.current = "create";
						}}
					>
						Create
					</Button>
					<Button
						variant="outline"
						type="submit"
						onClick={() => {
							actionRef.current = "join";
						}}
					>
						Join
					</Button>
				</div>
			</form>
		</Card>
	);
}

export default RoomForm;
