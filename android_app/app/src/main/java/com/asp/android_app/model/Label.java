package com.asp.android_app.model;

import androidx.annotation.Nullable;

/**
 * Represents a label returned from the backend.
 * Includes ID, name, and an optional parent's ID.
 */
public class Label {

    private int id;
    private String name;
    private Integer parent; // null means no parent

    /**
     * @return label's id
     */
    public int getId() {
        return id;
    }

    /**
     * @return label's name
     */
    public String getName() {
        return name;
    }

    /**
     * @return label's parent id, if there's no parent - null
     */
    public Integer getParent() {
        return parent;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        return obj instanceof Label && this.getId() == ((Label) obj).getId();
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(getId());
    }
}
