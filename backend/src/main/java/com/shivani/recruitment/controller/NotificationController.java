package com.shivani.recruitment.controller;

import com.shivani.recruitment.dto.NotificationDto;
import com.shivani.recruitment.entity.Notification;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(@AuthenticationPrincipal User user) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
        List<NotificationDto> dtos = list.stream().map(n -> NotificationDto.builder()
                .id(n.getId())
                .message(n.getMessage())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (notification.getRecipient().getId().equals(user.getId())) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return ResponseEntity.ok().build();
    }
}
