import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service.js";
import { TokenGuard } from "../../common/guards/token.guard.js";
import { CookieGuard } from "../../common/guards/cookie.guard.js";

@Controller('messages')
@UseGuards(CookieGuard, TokenGuard)
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get(':group')
    async getMessages(@Param('group') group: string) {
        return await this.messageService.getAll(group);
    }
}
