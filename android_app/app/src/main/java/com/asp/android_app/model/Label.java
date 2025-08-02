package com.asp.android_app.model;

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
}
