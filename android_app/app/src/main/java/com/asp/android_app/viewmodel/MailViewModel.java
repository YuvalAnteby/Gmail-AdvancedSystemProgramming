package com.asp.android_app.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.model.response.ReadStatus;
import com.asp.android_app.model.response.StarStatus;
import com.asp.android_app.model.response.TrashStatus;
import com.asp.android_app.repository.MailRepository;
import com.asp.android_app.utils.Result;

/**
 * ViewModel class for handling mail-related logic and exposing LiveData to the UI.
 * Acts as a bridge between the Repository and UI layer.
 */
public class MailViewModel extends AndroidViewModel {

    private final MailRepository mailRepository;

    private final MutableLiveData<Result<MailListResponse>> mailsListLiveData = new MutableLiveData<>();
    private final MutableLiveData<Result<Mail>> mailLiveData = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> deleteMailStatus = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> restoreMailStatus = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> readMailStatus = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> spamMailStatus = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> notSpamMailStatus = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> toggleStarMailStatus = new MutableLiveData<>();

    private int currentPage = 1;

    public MailViewModel(@NonNull Application application) {
        super(application);
        mailRepository = new MailRepository(application.getApplicationContext());
    }

    public LiveData<Result<MailListResponse>> getMailsLiveData() {
        return mailsListLiveData;
    }

    public LiveData<Result<Mail>> getMailLiveData() {
        return mailLiveData;
    }

    public LiveData<Result<Void>> getDeleteMailStatus() {
        return deleteMailStatus;
    }

    public LiveData<Result<Void>> getRestoreMailStatus() {
        return restoreMailStatus;
    }

    public LiveData<Result<Void>> getSpamMailStatus() {
        return spamMailStatus;
    }

    public LiveData<Result<Void>> getReadMailStatus() {
        return readMailStatus;
    }

    public LiveData<Result<Void>> getStarStatus() {
        return toggleStarMailStatus;
    }

    /**
     * Fetches mails for the given inbox type and current page.
     *
     * @param inboxType the inbox type ("incoming", "sent", etc.)
     */
    public void loadMails(String inboxType) {
        mailRepository.getMailsByType(inboxType, currentPage, mailsListLiveData);
    }

    public void nextPage(String inboxType) {
        currentPage++;
        loadMails(inboxType);
    }

    public void previousPage(String inboxType) {
        if (currentPage > 1) currentPage--;
        loadMails(inboxType);
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void resetPage() {
        currentPage = 1;
    }

    /**
     * Fetches a mail with a given id
     *
     * @param mailId mail id to fetch
     */
    public void fetchMailById(int mailId) {
        mailRepository.fetchMail(mailId, mailLiveData);
    }

    /**
     * Moves the mail with the given ID to the trash and updates LiveData.
     *
     * @param mailId The ID of the mail to delete
     */
    public void deleteMail(int mailId) {
        mailRepository.deleteMail(mailId, deleteMailStatus);
    }

    /**
     * Restores the mail with the given ID from the trash and updates LiveData.
     *
     * @param mailId The ID of the mail to restore
     */
    public void restoreMail(int mailId, TrashStatus status) {
        mailRepository.restoreMail(mailId, status, restoreMailStatus);
    }

    /**
     * Toggle the mail with the given ID spam flag and updates LiveData.
     *
     * @param request object containing the mail id to toggle it's spam flag
     */
    public void toggleSpam(SpamRequest request) {
        if (request.getIsPreviouslySpam()) {
            mailRepository.removeFromSpam(request, spamMailStatus);
        } else {
            mailRepository.markAsSpam(request, spamMailStatus);
        }
    }


    /**
     * Toggles the star flag of a mail
     *
     * @param mailId id of the mail to toggle the star flag for
     * @param status status of the star flag of a mail
     */
    public void toggleStar(int mailId, StarStatus status) {
        mailRepository.toggleStar(mailId, status, toggleStarMailStatus);
    }

    /**
     * Marks the read flag of a mail as true
     *
     * @param mailId id of the mail to mark the read flag as true
     * @param status status of the read flag of a mail
     */
    public void markAsRead(int mailId, ReadStatus status) {
        mailRepository.markRead(mailId, status, readMailStatus);
    }

    /**
     * Searches for emails with a given string
     *
     * @param query string to search by
     */
    public void searchMail(String query) {
        mailRepository.searchMails(query, mailsListLiveData);
    }

    // TODO Additional methods: sendNewMail

}