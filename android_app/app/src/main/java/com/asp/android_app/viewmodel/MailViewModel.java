package com.asp.android_app.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.model.Mail;
import com.asp.android_app.repository.MailRepository;
import com.asp.android_app.utils.Result;

import java.util.List;

/**
 * ViewModel class for handling mail-related logic and exposing LiveData to the UI.
 * Acts as a bridge between the Repository and UI layer.
 */
public class MailViewModel extends AndroidViewModel {

    private final MailRepository mailRepository;

    private final MutableLiveData<Result<List<Mail>>> mailsLiveData = new MutableLiveData<>();
    private int currentPage = 1;

    public MailViewModel(@NonNull Application application) {
        super(application);
        mailRepository = new MailRepository(application.getApplicationContext());
    }

    public LiveData<Result<List<Mail>>> getMailsLiveData() {
        return mailsLiveData;
    }

    /**
     * Fetches mails for the given inbox type and current page.
     *
     * @param inboxType the inbox type ("incoming", "sent", etc.)
     */
    public void loadMails(String inboxType) {
        mailRepository.getMailsByType(inboxType, currentPage, mailsLiveData);
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
}