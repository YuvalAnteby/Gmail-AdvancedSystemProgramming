package com.asp.android_app.utils;

/**
 * Generic class representing a result of a data operation.
 * Can be either a success (with data), an error (with message), or loading.
 *
 * @param <T> the type of data expected on success
 */
public abstract class Result<T> {

    /**
     * Represents a successful result.
     */
    public static final class Success<T> extends Result<T> {
        private final T data;

        public Success(T data) {
            this.data = data;
        }

        public T getData() {
            return data;
        }
    }

    /**
     * Represents an error result.
     */
    public static final class Error<T> extends Result<T> {
        private final String message;

        public Error(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    /**
     * Represents a loading state (e.g. network call in progress).
     */
    public static final class Loading<T> extends Result<T> {
    }
}