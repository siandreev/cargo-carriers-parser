type KeysEnum<T> = { [P in keyof Required<T>]: true };

export default KeysEnum;