package com.asp.android_app.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.model.Label;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.EditMailRequest;
import com.asp.android_app.model.request.SendMailRequest;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.repository.MailRepository;
import com.asp.android_app.utils.Result;

import java.util.List;

/**
 * ViewModel class for handling mail-related logic and exposing LiveData to the UI.
 * Acts as a bridge between the Repository and UI layer.
 */
public class MailViewModel extends AndroidViewModel {

    private final MailRepository mailRepository;

    private final MutableLiveData<Result<MailListResponse>> mailsListLiveData = new MutableLiveData<>();
    private final MutableLiveData<Result<Mail>> mailLiveData = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> editMailStatus = new MutableLiveData<>();
    private final MutableLiveData<Result<List<Mail>>> searchMailLiveData = new MutableLiveData<>();
    private final MutableLiveData<Result<Void>> sendMailStatus = new MutableLiveData<>();

    private int currentPage = 1;
    private boolean isLoadingMore = false;

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

    public LiveData<Result<Void>> getEditMailStatus() {
        return editMailStatus;
    }

    public LiveData<Result<List<Mail>>> getSearchData() {
        return searchMailLiveData;
    }

    public LiveData<Result<Void>> getSendMailStatus() {
        return sendMailStatus;
    }

    /**
     *  Loads the first page of mails (replaces current list)
     *
     * @param inboxType the inbox type ("incoming", "sent", etc.)
     */
    public void loadMails(String inboxType) {
        resetPage();
        isLoadingMore = false;
        mailRepository.getMailsByType(inboxType, currentPage, mailsListLiveData);
    }

    /**
     * Loads more mails for pagination (appends to current list)
     */
    public void loadMoreMails(String inboxType) {
        if (isLoadingMore) return;
        isLoadingMore = true;
        mailRepository.getMailsByType(inboxType, currentPage, mailsListLiveData);
    }

    public void nextPage(String inboxType) {
        currentPage++;
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

    public boolean isLoadingMore() {
        return isLoadingMore;
    }

    public void setLoadingMore(boolean loading) {
        isLoadingMore = loading;
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
     * Loads mails associated with a specific label.
     *
     * @param labelId the label ID
     */
    public void loadMailsByLabel(int labelId) {
        resetPage();
        isLoadingMore = false;
        mailRepository.getMailsByLabel(labelId, currentPage, mailsListLiveData);    }

    /**
     * Loads more mails by label for pagination (appends to current list)
     */
    public void loadMoreMailsByLabel(int labelId) {
        if (isLoadingMore) return;
        isLoadingMore = true;
        mailRepository.getMailsByLabel(labelId, currentPage, mailsListLiveData);
    }

    /**
     * Edits a sent mail with the allowed attributes
     *
     * @param mailId  id of a mail to edit
     * @param request object containing the allowed fields
     */
    public void editMail(int mailId, EditMailRequest request) {
        mailRepository.editMail(mailId, request, editMailStatus);
    }

    /**
     * Updates the labels assigned to mails
     *
     * @param mails list of mails to update
     * @param labels list of labels to assign
     */
    public void updateMailLabels(List<Mail> mails, List<Label> labels) {
        for (Mail m : mails)
            editMail(m.getId(), new EditMailRequest(null, null, null, labels));
    }

    /**
     * Moves the mail with the given ID to the trash and updates LiveData.
     *
     * @param mailId The ID of the mail to delete
     */
    public void deleteMail(int mailId) {
        mailRepository.deleteMail(mailId, editMailStatus);
    }

    /**
     * Restores the mail with the given ID from the trash and updates LiveData.
     *
     * @param mailId The ID of the mail to restore
     */
    public void restoreMail(int mailId) {
        editMail(mailId, new EditMailRequest(null, null, false, null));
    }

    /**
     * Marks the read flag of a mail as true
     *
     * @param m mail to mark as read
     */
    public void markAsRead(Mail m) {
        editMail(m.getId(), new EditMailRequest(true, m.isStarred(), m.isTrashed(), m.getLabels()));
    }

    /**
     * Toggles the star flag of a mail
     *
     * @param mailId    id of the mail to toggle the star flag for
     * @param isStarred status of the star flag of a mail
     */
    public void toggleStar(int mailId, boolean isStarred) {
        editMail(mailId, new EditMailRequest(null, isStarred, null, null));
    }

    /**
     * Toggle the mail with the given ID spam flag and updates LiveData.
     *
     * @param request object containing the mail id to toggle it's spam flag
     */
    public void toggleSpam(SpamRequest request) {
        mailRepository.toggleSpam(request, editMailStatus);
    }

    /**
     * Searches for emails with a given string
     *
     * @param query string to search by
     */
    public void searchMail(String query) {
        mailRepository.searchMails(query, searchMailLiveData);
    }

    /**
     *
     * @param req
     */
    public void sendNewMail(SendMailRequest req) {
       mailRepository.sendMail(req, sendMailStatus);
    }

    /**
     *
     * @param mailId
     * @param req
     */
    public void updateDraft(int mailId, SendMailRequest req) {
        mailRepository.updateDraft(mailId, req, sendMailStatus);
    }
}