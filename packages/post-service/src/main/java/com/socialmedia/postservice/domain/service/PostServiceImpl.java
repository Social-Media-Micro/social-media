package com.socialmedia.postservice.domain.service;

import com.socialmedia.postservice.infra.models.Post;
import com.socialmedia.postservice.infra.repository.PostServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostServiceImpl implements PostServiceInterface {

    @Autowired
    private final PostServiceRepository postServiceRepository;

    public PostServiceImpl(PostServiceRepository postServiceRepository) {
        this.postServiceRepository = postServiceRepository;
    }


    @Override
    public void savePost(Post post){
        postServiceRepository.save(post);
    }

    @Override
    public Optional<Post> updatePost(UUID postId, String content){
        Optional<Post> originalPost = postServiceRepository.findById(postId);
        originalPost.ifPresent(post -> {
            post.setContent(content);
            postServiceRepository.save(post);
        });
        return originalPost;
    }

    @Override
    public Optional<Post> getPost(UUID postId){
        return postServiceRepository.findById(postId);
    }

    @Override
    public List<Post> getAllPostByUserId(UUID userId){
        return postServiceRepository.findAllByUserId(userId);
    }

    @Override
    public void deletePost(UUID postId){
        postServiceRepository.deleteById(postId);
    }

    @Override
    public Optional<Post> like(UUID postId){
        Optional<Post> originalPost = postServiceRepository.findById(postId);
        originalPost.ifPresent(post -> {
            post.setTotalLikes(post.getTotalLikes()+1);
            postServiceRepository.save(post);
        });
        return originalPost;
    }
}
