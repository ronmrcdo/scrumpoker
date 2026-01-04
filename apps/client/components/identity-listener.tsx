"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import useBoundStore from "@/stores";

const IdentityListener = () => {
	const { generateClientId } = useBoundStore(
		useShallow((state) => ({ generateClientId: state.generateClientId })),
	);

	useEffect(() => {
		generateClientId();
	}, [generateClientId]);

	return null;
};

export default IdentityListener;
