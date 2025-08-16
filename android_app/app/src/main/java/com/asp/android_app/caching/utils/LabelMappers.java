package com.asp.android_app.caching.utils;

import com.asp.android_app.caching.entities.LabelEntity;
import com.asp.android_app.model.Label;

import java.util.ArrayList;
import java.util.List;

/**
 * Tiny mapper between network Label and Room LabelEntity.
 */
public final class LabelMappers {
    private LabelMappers(){}

    public static LabelEntity toEntity(Label l) {
        LabelEntity e = new LabelEntity();
        e.id = l.getId();
        e.name = l.getName();
        e.parent = l.getParent();
        return e;
    }

    public static List<LabelEntity> toEntities(List<Label> ls) {
        List<LabelEntity> out = new ArrayList<>();
        if (ls == null) return out;
        for (Label l : ls) out.add(toEntity(l));
        return out;
    }
}
