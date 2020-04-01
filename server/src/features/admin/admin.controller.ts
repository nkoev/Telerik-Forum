import { Controller, Param, Put, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AccessLevel } from "../../common/decorators/roles.decorator";
import { ForumSystemException } from "../../common/exceptions/system-exception";

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {

  constructor(private readonly adminService: AdminService) { }

  @AccessLevel('Admin')
  @Put('/users/:userId/banstatus')
  async banUsers(
    @Param('userId') userId: string, ) {

    throw new ForumSystemException('something', 401)
    return await this.adminService.banUsers(userId)
  }
}