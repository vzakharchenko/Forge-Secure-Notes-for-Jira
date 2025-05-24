export interface SchedulerTriggerRequest {
    context: {
        cloudId: string;
        moduleKey: string;
    };
    contextToken: string;
}

export interface SchedulerTriggerContext {
    installContext: string;
}

export interface SchedulerTriggerResponse<BODY> {
    body?: BODY;
    headers?: Record<string, string[]>;
    statusCode: number;
    statusText?: string;
}

export const getHttpResponse = <Body>(statusCode: number, body: Body): SchedulerTriggerResponse<Body> => {
    let statusText = "";
    if (statusCode === 200) {
        statusText = "Ok";
    } else if (statusCode === 404) {
        statusText = "Not Found";
    } else {
        statusText = "Bad Request";
    }

    return {
        headers: { "Content-Type": ["application/json"] },
        statusCode,
        statusText,
        body,
    };
};

export abstract class SchedulerTrigger {
    abstract handler(
        request: SchedulerTriggerRequest,
        context: SchedulerTriggerContext
    ): Promise<SchedulerTriggerResponse<string>>;
}
