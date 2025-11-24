//DOM-based To-Do list logic for WebAssembly
//No canvas/WebGL, only pure data+operations

#include <stdio.h>
#include <string.h>
#include <emscripten/emscripten.h>

#define MAX_TASKS 100

typedef struct {
    char title[64];
    int completed;   //0 = not done, 1 = done
} Task;

static Task tasks[MAX_TASKS];
static int task_count = 0;

/* CORE OPERATIONS (exported to JS) */

EMSCRIPTEN_KEEPALIVE
int getTaskCount(void) {
    return task_count;
}

EMSCRIPTEN_KEEPALIVE
const char *getTaskTitle(int index) {
    if (index < 0 || index >= task_count) return "";
    return tasks[index].title;
}

EMSCRIPTEN_KEEPALIVE
int getTaskCompleted(int index) {
    if (index < 0 || index >= task_count) return 0;
    return tasks[index].completed;
}

EMSCRIPTEN_KEEPALIVE
void clearTasks(void) {
    task_count = 0;
}

EMSCRIPTEN_KEEPALIVE
void addTask(const char *title) {
    if (task_count >= MAX_TASKS) return;

    strncpy(tasks[task_count].title, title, 63);
    tasks[task_count].title[63] = '\0';
    tasks[task_count].completed = 0;
    task_count++;
}

EMSCRIPTEN_KEEPALIVE
void deleteTask(int index) {
    if (index < 0 || index >= task_count) return;

    for (int i = index; i < task_count - 1; ++i) {
        tasks[i] = tasks[i + 1];
    }
    task_count--;
}

EMSCRIPTEN_KEEPALIVE
void toggleTask(int index) {
    if (index < 0 || index >= task_count) return;
    tasks[index].completed = !tasks[index].completed;
}

EMSCRIPTEN_KEEPALIVE
void editTask(int index, const char *newTitle) {
    if (index < 0 || index >= task_count) return;

    strncpy(tasks[index].title, newTitle, 63);
    tasks[index].title[63] = '\0';
}

int main(void) {
    printf("WASM To-Do core ready.\n");
    return 0;
}
