package com.socialmedia.postservice.domain.service;

import com.socialmedia.postservice.infra.models.Post;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public interface PostServiceInterface {
    void savePost(Post post);

    Optional<Post> updatePost(UUID postId, String content);

    Optional<Post> getPost(UUID postId);

    List<Post> getAllPostByUserId(UUID userId);

    void deletePost(UUID postId);

    Optional<Post> like(UUID postId);
}
