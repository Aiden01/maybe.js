export const Just = <T>(value: T) => new Maybe(false, value);
export const Nothing = <T>() => new Maybe<T>(true);

interface Monad<T> {
	bind: <A>(f: (_: T) => Monad<A>) => Monad<A>;
}

interface Functor<T> {
	fmap: <A>(f: (_: T) => A) => Functor<A>;
}

interface Applicative<T> {
	apply: <A>(f: Functor<T>) => Functor<A>;
}

export class Maybe<T> implements Monad<T>, Functor<T>, Applicative<T> {
	constructor(private nothing: boolean, private value?: T) {}
	bind<A>(f: (value: T) => Monad<A>): Monad<A> {
		if (this.isNothing()) {
			return Nothing();
		}
		return f(this.fromJust());
	}

	fmap<A>(f: (value: T) => A): Maybe<A> {
		if (this.isNothing()) {
			return Nothing();
		}
		return Just(f(this.value));
	}

	apply<A>(f: Functor<T>): Functor<A> {
		if (this.isNothing()) {
			return Nothing();
		}
		const fn = this.fromJust() as unknown;
		return f.fmap(fn as (_: T) => A);
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

	eq(m: Maybe<T>): boolean {
		if (m.isJust() && this.isJust()) {
			return m.fromJust() === this.fromJust();
		}
		if (m.isNothing() && this.isNothing()) {
			return true;
		}
		return false;
	}
}
