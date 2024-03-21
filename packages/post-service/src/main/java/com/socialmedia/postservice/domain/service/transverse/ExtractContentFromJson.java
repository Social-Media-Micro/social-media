package com.socialmedia.postservice.domain.service.transverse;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import org.springframework.stereotype.Component;

@Component
public class ExtractContentFromJson {
    public String with (String requestBody) {
        try {
            JsonObject jsonObject = new JsonParser().parse(requestBody).getAsJsonObject();

            return jsonObject.get("content").getAsString();
        } catch (JsonSyntaxException | IllegalStateException | NullPointerException e) {

            e.printStackTrace();
            return null;
        }
    }
}
