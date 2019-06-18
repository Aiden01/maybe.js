export const Just = <T>(value: T) => new Maybe(false, value);
export const Nothing = <T>() => new Maybe<T>(true);

export class Maybe<T> {
	constructor(private nothing: boolean, private value?: T) {}

	map<A>(f: (value: T) => A): Maybe<A> {
		if (this.isNothing()) {
			return Nothing();
		}
		return Just(f(this.value));
	}

	isJust(): boolean {
		return !this.nothing;
	}

	isNothing(): Boolean {
		return this.nothing;
	}

	fromJust(): T {
		if (this.isNothing()) {
			throw new Error('Called unwrap on Nothing');
		}
		return this.value;
	}

	maybe<A>(defaultValue: A, f: (value: T) => A): Maybe<A> {
		const newValue = this.nothing ? defaultValue : f(this.value);
		return Just(newValue);
	}

	fromMaybe(defaultValue: T): Maybe<T> {
		const newValue = this.nothing ? defaultValue : this.value;
		return Just(newValue);
	}

	maybeToList(): T[] {
		if (this.isNothing()) {
			return [];
		}
		return [this.fromJust()];
	}

	static catMaybes<A>(maybes: Maybe<A>[]): A[] {
		return maybes.reduce(
			(acc, m) => (m.isNothing() ? acc : [...acc, m.fromJust()]),
			[]
		);
	}

	static listToMaybe<A>([value]: A[]): Maybe<A> {
		if (!value) {
			return Nothing();
		}
		return Just(value);
	}
}
