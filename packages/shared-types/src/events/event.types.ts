export type UnknownDictionary = Record<string, unknown>;

export type Event<
	TType extends string = string,
	TPayload extends UnknownDictionary = UnknownDictionary,
> = {
	type: TType;
	payload: TPayload;
};
